#!/usr/bin/env bash

PACKAGES_ROOT=./packages
PKG_PREFIX=''
PKG_NAME=$1
VERSION_INCREMENT=$2

cd $PACKAGES_ROOT/$PKG_NAME && \
	VERSION=$(npm version --no-git-tag-version $VERSION_INCREMENT) && \
	git add package.json && \
	git commit -m "chore($PKG_NAME): $VERSION" && \
	git tag -a "$PKG_PREFIX$PKG_NAME@$VERSION" -m "$PKG_PREFIX$PKG_NAME@$VERSION" && \
	echo $VERSION
