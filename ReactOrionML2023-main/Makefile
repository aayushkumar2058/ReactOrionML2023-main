# Makefile
usage:
	@echo
	@echo '		setup			setup environment'
	@echo '		build			setup and builds the production ready build'
	@echo

# Build the application distribution
.PHONY: build
build\:prod: 
	@ # Run task for production build
	@npm run build:prod

build\:stage: 
	@ # Run task for production build
	@npm run build:stage

build\:qa: 
	@ # Run task for production build
	@npm run build:qa

setup:
	@ # install node modules
	@npm install --verbose
	@npx npm-force-resolutions
	@npm install