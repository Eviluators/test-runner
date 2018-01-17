https://devcenter.heroku.com/articles/container-registry-and-runtime#pushing-an-image-s

Getting started
Make sure you have a working Docker installation (eg. docker ps) and that you’re logged in to Heroku (heroku login).

Log in to Container Registry:

$ heroku container:login
Get sample code by cloning an Alpine-based python example:

$ git clone https://github.com/heroku/alpinehelloworld.git
Navigate to the app’s directory and create a Heroku app:

$ heroku create
Creating salty-fortress-4191... done, stack is cedar-14
https://salty-fortress-4191.herokuapp.com/ | https://git.heroku.com/salty-fortress-4191.git
Build the image and push to Container Registry:

$ heroku container:push web
Now open the app in your browser:

$ heroku open
Logging in to the registry
Heroku runs a container registry on registry.heroku.com.

If you are using the Heroku CLI, you can log in with:

$ heroku container:login
or directly via the Docker CLI:

$ docker login --username=\_ --password=$(heroku auth:token) registry.heroku.com
Pushing an image(s)
Build an image and push
To build an image and push it to Container Registry, make sure that your directory contains a Dockerfile. Then run:

$ heroku container:push <process-type>
Even if a process type is specified, a push to the registry will restart all processes. For example, if you specify web your worker processes will also be restarted.

Pushing an existing image
To push an image to Heroku, such as one pulled from Docker Hub, tag it and push it according to this naming template:

$ docker tag <image> registry.heroku.com/<app>/<process-type>
$ docker push registry.heroku.com/<app>/<process-type>
After the image has successfully been pushed, open your app:

$ heroku open -a <app>
