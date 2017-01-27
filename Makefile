NPM_BIN = $(shell npm bin)

# Directories
PKGS_ROOT := packages

pkg-dir = $(PKGS_ROOT)/$1

# Defines the following rules for the specified package:
define pkg-rules

# test-package rule
check-$1:
	cd $(call pkg-dir,$1) && npm run check

# test-package rule
test-$1:
	cd $(call pkg-dir,$1) && npm test

$(call pkg-dir,$1)/node_modules:
	cd $(call pkg-dir,$1) && npm install

clean-$1:
	rm -rf $(call pkg-dir,$1)/node_modules

# install-packge rule to install
install-$1: $(call pkg-dir,$1)/node_modules

# link-package rule to link the output directory
link-$1:
	cd $(call pkg-dir,$1) && npm link

# unlink-package rule to link the output directory
unlink-$1:
	cd $(call pkg-dir,$1) && npm link

# version-package rule to increment package version
# usage: make VERSION=major|minor|patch verison-<package-name>
# ex: make VERSION=patch version-foo
version-$1:
	bash scripts/version.sh $1 ${VERSION}

# publish-package rule to publish a package
publish-$1:
	cd $(call pkg-dir,$1) && npm publish

# release-package rule to release a new package
# usage: make VERSION=major|minor|patch release-<package-name>
# ex: make VERSION=patch release-foo
release-$1: check-$1 version-$1 publish-$1

prerelease-$1: check-$1 version-$1
	cd $(call pkg-dir,$1) && npm publish --tag beta

check-packages: check-$1
clean-packages: clean-$1
install-packages: install-$1
test-packages: test-$1

.PHONY: prerelease-$1 release-$1 publish-$1 version-$1 unlink-$1 link-$1 check-$1 test-$1 clean-$1 clean-packages test-packages check-packages
endef

# Creates rules for the specified package
add-pkg = $(eval $(call pkg-rules,$1))

# Create rules for all packages
PKGS := $(notdir $(wildcard $(PKGS_ROOT)/*))
$(foreach p,$(PKGS),$(call add-pkg,$p))

clean: clean-packages
	rm -rf node_modules

# install node_modules for working on packages
node_modules: package.json
	npm install

# install node_modules for packages
install: node_modules

# test all the things!
test: install install-packages test-packages

# check all the things!
check: install install-packages check-packages

# setup all the things!
all: install install-packages

# Will be filled in by pkg-rules
.PHONY: all test check

.DEFAULT_GOAL := all
