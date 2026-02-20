#/bin/bash

release=$1
if [ -z "$release" ]; then
       echo "Usage: $0 <old version number> <new version number>"
       exit
fi       

# Set up paths
scriptpath=$(realpath "$0")
scriptdir=$(dirname $scriptpath)
basedir=$(dirname $scriptdir)

# Update/minify CSS and JS
uglifycss $basedir/src/css/snapselect.css >$basedir/dist/css/snapselect.min.css
uglifyjs $basedir/src/js/snapselect.js >$basedir/dist/js/snapselect.min.js

# Update version file, JS header, and package.json
echo $release >$basedir/VERSION

# --- NPM: update version and publish ---
if [ -f "$basedir/package.json" ]; then
    # Update package.json version (no git tag, since we'll handle it manually)
    npm version $release --no-git-tag-version

    # Publish to npm (scoped package, so --access public)
    npm publish --access public
fi

# --- GitHub release steps as before ---
# Create a zip of the new release for GitHub (but not for npm)
cd $basedir/..
pwd
zip -r snapselect.zip snapselect -x '*.git*' '*.less' -x 'snapselect/dist*' -x 'snapselect/script*' -x 'snapselect/*json' -x 'snapselect/.npmignore'
mv snapselect.zip $basedir/dist/

cd $basedir
git add VERSION dist/* package.json
git commit -m "release $release" -a
git push
gh release create "v${release}" --generate-notes ./dist/*.zip
