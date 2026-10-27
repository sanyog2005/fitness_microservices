FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh

# Strip Windows carriage returns (CRLF -> LF) and make executable
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 1000

ENTRYPOINT ["/entrypoint.sh"]
