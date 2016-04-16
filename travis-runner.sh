npm test
# if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]
# then
    # API Docs Setup & Deploying
    echo Setting up API Docs and Deploying to Firebase
    npm run apidoc
    firebase deploy --token "$FIREBASE_TOKEN"
# fi