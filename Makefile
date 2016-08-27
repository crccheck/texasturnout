
help: ## Shows this help
	@echo "$$(grep -h '#\{2\}' $(MAKEFILE_LIST) | sed 's/: #\{2\} /	/' | column -t -s '	')"


.PHONY: translate
translate: ## Do translations (run before .pot and after .po)
	mkdir -p $@
	node_modules/.bin/jspot extract scripts/rosedale.js -k _ --target $@
	node_modules/.bin/jspot json translate/en_US.po --target $@
	node_modules/.bin/jspot json translate/es_US.po --target $@
