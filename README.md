# codbex-opportunities
Opportunitues Management Application

### Model

![model](images/opportunities-model.png)

### Application

#### Launchpad

![launchpad](images/opportunities-launchpad.png)

### Infrastructure

#### Build

	docker build -t codbex-opportunities:1.0.0 .

#### Run

	docker run --name codbex-opportunities -d -p 8080:8080 codbex-opportunities:1.0.0

#### Clean

	docker rm codbex-opportunities