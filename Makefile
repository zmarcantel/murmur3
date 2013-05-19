MOCHA			= node_modules/mocha/bin/mocha

test:
	@npm install --dev
	$(MOCHA) --reporter spec

deploy: test
	git push -u origin master
	npm publish

.PHONY: test
