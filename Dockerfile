# Docker descriptor for codbex-opportunities
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.19.0

COPY codbex-opportunities target/dirigible/repository/root/registry/public/codbex-opportunities
COPY codbex-opportunities-data target/dirigible/repository/root/registry/public/codbex-opportunities-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-opportunities/gen/index.html