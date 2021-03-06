# WatchlistFrontend

# Deployment

## ARM Deployment (e.g. Raspberry PI)
In project directory use following commands.  
To install all needed dependencies "sudo npm install -g @angular/cli"  
and "sudo npm install"  
To build project "npm run build" or "npm run build --prod"  
To build docker image "docker build -t watchlistfrontend:latest ."  
To run docker container "docker run -d -it --name watchlistFrontend -p 4200:80 watchlistfrontend:latest"  
Congratulations! Your website can be reached on http://{ip-address}:4200/  
Hint: If you want to start the container on startup of your machine automatically insert the additional flag "--restart always" to the "docker run"-command.  

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
