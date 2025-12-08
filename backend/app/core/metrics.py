"""
Prometheus metrics for LANA AI Platform
"""
from typing import Dict
from datetime import datetime
import threading


class SimpleMetrics:
    """Simple in-memory metrics collector (Prometheus-compatible format)"""

    def __init__(self):
        self._lock = threading.Lock()
        self._counters: Dict[str, int] = {}
        self._gauges: Dict[str, float] = {}
        self._histograms: Dict[str, list] = {}
        self._start_time = datetime.utcnow()

    def inc_counter(self, name: str, value: int = 1, labels: Dict[str, str] = None):
        """Increment counter"""
        key = self._make_key(name, labels)
        with self._lock:
            self._counters[key] = self._counters.get(key, 0) + value

    def set_gauge(self, name: str, value: float, labels: Dict[str, str] = None):
        """Set gauge value"""
        key = self._make_key(name, labels)
        with self._lock:
            self._gauges[key] = value

    def observe_histogram(self, name: str, value: float, labels: Dict[str, str] = None):
        """Observe value for histogram"""
        key = self._make_key(name, labels)
        with self._lock:
            if key not in self._histograms:
                self._histograms[key] = []
            self._histograms[key].append(value)
            # Keep last 1000 observations
            if len(self._histograms[key]) > 1000:
                self._histograms[key] = self._histograms[key][-1000:]

    def _make_key(self, name: str, labels: Dict[str, str] = None) -> str:
        """Create metric key with labels"""
        if not labels:
            return name
        label_str = ",".join(f'{k}="{v}"' for k, v in sorted(labels.items()))
        return f"{name}{{{label_str}}}"

    def get_prometheus_format(self) -> str:
        """Export metrics in Prometheus text format"""
        lines = []

        # Uptime
        uptime = (datetime.utcnow() - self._start_time).total_seconds()
        lines.append(f"# HELP lana_uptime_seconds Application uptime in seconds")
        lines.append(f"# TYPE lana_uptime_seconds gauge")
        lines.append(f"lana_uptime_seconds {uptime:.2f}")

        # Counters
        for key, value in self._counters.items():
            lines.append(f"{key} {value}")

        # Gauges
        for key, value in self._gauges.items():
            lines.append(f"{key} {value}")

        # Histogram summaries
        for key, values in self._histograms.items():
            if values:
                avg = sum(values) / len(values)
                lines.append(f"{key}_avg {avg:.4f}")
                lines.append(f"{key}_count {len(values)}")

        return "\n".join(lines)

    def get_stats(self) -> dict:
        """Get metrics as dictionary"""
        uptime = (datetime.utcnow() - self._start_time).total_seconds()

        stats = {
            "uptime_seconds": round(uptime, 2),
            "counters": dict(self._counters),
            "gauges": dict(self._gauges),
        }

        # Add histogram stats
        for key, values in self._histograms.items():
            if values:
                stats[f"{key}_avg"] = round(sum(values) / len(values), 4)
                stats[f"{key}_count"] = len(values)

        return stats


# Global metrics instance
metrics = SimpleMetrics()


# Metric names
class MetricNames:
    HTTP_REQUESTS_TOTAL = "lana_http_requests_total"
    HTTP_REQUEST_DURATION = "lana_http_request_duration_seconds"
    AI_REQUESTS_TOTAL = "lana_ai_requests_total"
    AI_TOKENS_TOTAL = "lana_ai_tokens_total"
    AI_COST_RUB_TOTAL = "lana_ai_cost_rub_total"
    PAYMENTS_TOTAL = "lana_payments_total"
    PAYMENTS_AMOUNT_RUB = "lana_payments_amount_rub_total"
    ACTIVE_USERS = "lana_active_users"
    AUTH_ATTEMPTS = "lana_auth_attempts_total"
    ERRORS_TOTAL = "lana_errors_total"


# Helper functions
def track_request(method: str, path: str, status_code: int, duration: float):
    """Track HTTP request metrics"""
    metrics.inc_counter(
        MetricNames.HTTP_REQUESTS_TOTAL,
        labels={"method": method, "path": path, "status": str(status_code)}
    )
    metrics.observe_histogram(
        MetricNames.HTTP_REQUEST_DURATION,
        duration,
        labels={"method": method, "path": path}
    )


def track_ai_request(model: str, tokens: int, cost_rub: float):
    """Track AI request metrics"""
    metrics.inc_counter(MetricNames.AI_REQUESTS_TOTAL, labels={"model": model})
    metrics.inc_counter(MetricNames.AI_TOKENS_TOTAL, tokens, labels={"model": model})
    metrics.inc_counter(MetricNames.AI_COST_RUB_TOTAL, int(cost_rub * 100), labels={"model": model})


def track_payment(status: str, amount_rub: float):
    """Track payment metrics"""
    metrics.inc_counter(MetricNames.PAYMENTS_TOTAL, labels={"status": status})
    if status == "succeeded":
        metrics.inc_counter(MetricNames.PAYMENTS_AMOUNT_RUB, int(amount_rub))


def track_auth(event_type: str, success: bool):
    """Track authentication metrics"""
    metrics.inc_counter(
        MetricNames.AUTH_ATTEMPTS,
        labels={"event": event_type, "success": str(success).lower()}
    )


def track_error(error_type: str):
    """Track error metrics"""
    metrics.inc_counter(MetricNames.ERRORS_TOTAL, labels={"type": error_type})
