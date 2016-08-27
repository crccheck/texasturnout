
help: ## Shows this help
	@echo "$$(grep -h '#\{2\}' $(MAKEFILE_LIST) | sed 's/: #\{2\} /	/' | column -t -s '	')"


.PHONY: locales
locales: ## Do translations (run before .pot and after .po)
	mkdir -p $@
	node_modules/.bin/jspot extract scripts/rosedale.js -k _ --target $@
	node_modules/.bin/jspot json $@/en_US.po --target $@
	node_modules/.bin/jspot json $@/es_US.po --target $@
