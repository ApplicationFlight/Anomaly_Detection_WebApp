# Anomaly Detection Server - WebApp

[Click here for the Demo Video](https://youtu.be/ZN5gbD_lrnE)

This project is a web application, developed in JavaScript with `Node.js`, and `React` for interface. The app uses a client-server structure and MVC architecture, it detects flight anomalies from data flight stored in `.csv` files.

The user uploads a correct flight in `.csv` form for training, followed by a current flight in `.csv` form, which will be checked against the former to detect anomalies. The user can chose among 2 algorithms for detections: 'Regression' or 'Hybrid'.

## Getting Started

### Prerequisites
The app is available for every OS. Before compiling and running, please make sure to have installed `node ^16.1.0` and to have available ports: `9876, 8080`.

In addition, prepare your `.csv` file for training and detection. A correct file is:

- Either a `csv` type or a `vnd.ms-excel` type (for windows convenience)
- Has the name of columns in the first line which are names of features of the data flight
- A new line is represented by `\n`
- The train and anomaly file should have the same amount of columns and same names of columns for consistency purposes

Some of the cases mentioned above are checked (and rejected) by the app. But **we do not take responsibility for run-time errors** caused by an illegal flight file.

We provide an example under the folder 'FilesExample'.

## Compiling & Running

Compiling and running are extremely easy. After downloading the project form `git`, enter the directory from `terminal/cmd` and type:
1. npm install
2. npm run

This will install and run **both server and client**, giving you access to the whole webapp at address: `http://localhost:8080/`.
The app will automatically open the page for convenience, but you are free to close it and visit  `http://localhost:8080/` as long as the project is running on  `terminal/cmd`.

## Deployment

### Technologies Used:
Main technologies:
- `Javascript`
- `Node.js`
- `React`
- `CSS`

The HTTP connection is made using:
- `Express` (on server side)
- `Axios` (on client side)

Various other libraries have been used, mainly on the client interface side,  you are free to check all the dependencies in the client `package.json` file.

### MVC Architechture

**Model**: the detection algorithm lay here.  
**View**: the page interface in React + the client api lay here.  
**Controller**: the server lays here.  

**Other Folders**
The configuration folder defines important configs for the entire app. (such as communication ports and addresses)

## Functionalities

On the set-up box (on the left), you can firstly pick which type of algorithm you want to use. You can then proceed to upload the relevant files in the drag-zone. Once the set-up is ready, you can send to server with the 'send' button. The 'send' button won't work until the set-up has been completed.  
After sending, as you examine the anomalies received, all set-up buttons will get disabled. In case you want a new detection, click on the 'restart' button next to the 'send'.

<kbd>
  <img src="MediaReadMe/firstpage.png" width="800"/>
</kbd>

<br/><br/>
The request will send an `HTTP POST` at port `9876` to server. The type of algorithm selected will be included as a query parameter. As of:
```
http://localhost:8080/detect/?model_type=hybrid
```
The body of the request will include both train and anomaly files already converted as `json` objects.
The server will return an array of anomalies, encoded as `json` objects.

After sending, you will be able to see the anomalies received. You'll see the number of anomalies detected in the title. The table has many functionalities.
You can pick how many rows to see in one page, and you can scroll the pages freely. You can search up in the whole table, or filter only a specific column.
You can decide to sort by whichever column clicking on the arrow next to the column title.

<kbd>
  <img src="anomalies/firstpage.png" width="800"/>
</kbd>

<br/><br/>

## Authors
- [Sara Spagnoletto](https://github.com/saraspagno)
- Eva Hallermeier
- Samuel Memmi
- Gali Seregin
