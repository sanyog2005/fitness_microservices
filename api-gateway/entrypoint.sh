#!/bin/sh
set -e

# Default port to Render's $PORT, or 1000 for local docker compose
export PORT="${PORT:-1000}"

# Helper function to sanitize URLs (strip trailing slashes, auto-append .onrender.com if needed, prepend https:// if missing)
format_url() {
  url="$1"
  url="${url%/}"

  # Preserve local Docker compose service names
  case "$url" in
    *auth-service:1001*|*event-service:1002*|*booking-service:1003*|*payment-service:1004*)
      case "$url" in
        http://*) echo "$url"; return 0 ;;
        *) echo "http://$url"; return 0 ;;
      esac
      ;;
  esac

  # Strip existing protocols
  url="${url#http://}"
  url="${url#https://}"

  # Strip internal ports if present on Render service names
  case "$url" in
    fitness-*:*) url="${url%%:*}" ;;
  esac

  # Auto-append .onrender.com if no domain dot exists
  case "$url" in
    *.*) ;;
    *) url="${url}.onrender.com" ;;
  esac

  echo "https://$url"
}


# Helper function to extract hostname (e.g. https://fitness-auth.onrender.com -> fitness-auth.onrender.com)
extract_host() {
  url="$1"
  echo "$url" | sed -e 's|^[^/]*//||' -e 's|/.*$||'
}

# Format service URLs with local Docker network fallbacks
export AUTH_SERVICE_URL=$(format_url "${AUTH_SERVICE_URL:-http://auth-service:1001}")
export EVENT_SERVICE_URL=$(format_url "${EVENT_SERVICE_URL:-http://event-service:1002}")
export BOOKING_SERVICE_URL=$(format_url "${BOOKING_SERVICE_URL:-http://booking-service:1003}")
export PAYMENT_SERVICE_URL=$(format_url "${PAYMENT_SERVICE_URL:-http://payment-service:1004}")

# Extract hostnames for the Host header
export AUTH_HOST=$(extract_host "$AUTH_SERVICE_URL")
export EVENT_HOST=$(extract_host "$EVENT_SERVICE_URL")
export BOOKING_HOST=$(extract_host "$BOOKING_SERVICE_URL")
export PAYMENT_HOST=$(extract_host "$PAYMENT_SERVICE_URL")

echo "=========================================="
echo "🚀 Starting Fitness API Gateway"
echo "  Port:            ${PORT}"
echo "  Auth Service:    ${AUTH_SERVICE_URL} (${AUTH_HOST})"
echo "  Event Service:   ${EVENT_SERVICE_URL} (${EVENT_HOST})"
echo "  Booking Service: ${BOOKING_SERVICE_URL} (${BOOKING_HOST})"
echo "  Payment Service: ${PAYMENT_SERVICE_URL} (${PAYMENT_HOST})"
echo "=========================================="

# Substitute only our designated variables so internal Nginx variables remain intact
envsubst '$PORT $AUTH_SERVICE_URL $EVENT_SERVICE_URL $BOOKING_SERVICE_URL $PAYMENT_SERVICE_URL $AUTH_HOST $EVENT_HOST $BOOKING_HOST $PAYMENT_HOST' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx in foreground
exec nginx -g 'daemon off;'
