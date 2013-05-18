MOCHA			= node_modules/mocha/bin/mocha

test:
	@npm install --dev
	$(MOCHA) --reporter spec

.PHONY: test