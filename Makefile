
help: ## Shows this help
	@echo "$$(grep -h '#\{2\}' $(MAKEFILE_LIST) | sed 's/: #\{2\} /	/' | column -t -s '	')"


.PHONY: translate
translate: ## Find text to translate
	mkdir -p $@
	node_modules/.bin/jspot extract scripts/rosedale.js -k _ --target $@
