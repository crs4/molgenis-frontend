FROM nginx:1.16.0
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY conf.d/preview.conf /etc/nginx/conf.d/
COPY proxy.d/backend.conf /etc/nginx/proxy.d/
# COPY dist /usr/share/nginx/html/
VOLUME [ "/usr/share/nginx/html/@molgenis-ui" ]
VOLUME [ "/usr/share/nginx/html/@molgenis-experimental" ]