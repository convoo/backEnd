npm start
npm test
# npm run test:local
if grep -q " failing" mocha.log; then
   exit 1
# else
#     cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
fi
if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
    # API Docs Setup & Deploying
    echo Setting up API Docs and Deploying to Firebase
    npm run apidoc
    firebase deploy --token "$FIREBASE_TOKEN"
fi
