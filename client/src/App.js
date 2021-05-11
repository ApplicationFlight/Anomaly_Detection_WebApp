import React, { Component } from 'react';
import {createApiClient, Anomaly} from './api';


import DragAndDrop from './Components/DragAndDrop/DragAndDrop'
import './App.css'
import './table.css'

export type AppState = {
	anomalies?: Anomaly[],
}

const api = createApiClient();

const RenderRow = (props) =>{
	return props.keys.map((key, index)=>{
		return <td key={props.data[key]}>{props.data[key]}</td>
	})
}

export class App extends Component {

  constructor(props) {
    super(props);
		this.postData = this.postData.bind(this);
  }

	state: AppState = {}

  postData (file1, file2, algorithm) {
		let train_object = {}, anomaly_object = {};
		var reader1 = new FileReader();
		var reader2 = new FileReader();
		const scope = this;
		reader1.onload = async function (event) {
			var lines = event.target.result.split('\n');
			lines[0].split(',').forEach(function (column, i) {
				let value = [];
				for (var j = 1; j < lines.length; j++) {
					value.push(lines[j].split(',')[i]);
				}
				train_object[column] = value;
			});
			scope.setState({
				anomalies: await api.postData(train_object, anomaly_object, algorithm)
			})
		}
		reader2.onload = function (event) {
			var lines = event.target.result.split('\n');
			lines[0].split(',').forEach(function (column, i) {
				let value = [];
				for (var j = 1; j < lines.length; j++) {
					value.push(lines[j].split(',')[i]);
				}
				anomaly_object[column] = value;
			});
			reader1.readAsBinaryString(file1);
		}
		reader2.readAsBinaryString(file2);
	}

	getRowsData = function(){
		var items = this.state.anomalies;
		var keys = Object.keys(this.state.anomalies[0]);
		return items.map((row, index)=>{
			return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
		})
	}

	renderAnomalies = (anomalies: Anomaly[]) => {
		return (
			<div>
				<table className="table">
					<thead>
						<tr>
							<th> Timestep </th>
							<th> Correlated Feature 1 </th>
							<th> Correlated Feature 2 </th>
						</tr>
					</thead>
					<tbody>
						{this.getRowsData()}
					</tbody>
				</table>
			</div>
	 );
	 }

  render() {
		const {anomalies} = this.state;

    return (
			<main>
				<header>
				</header>
				<link rel="stylesheet" media="screen" href="https://fontlibrary.org/face/glacial-indifference" type="text/css"/>
				<div className="left">
					<div className="logo">
					</div>
					<DragAndDrop postData={this.postData} className="DragAndDrop"/>
				</div>
				<div className="right">
					<div className = "anomalies">
					{anomalies ? <div className='results'>Showing {anomalies.length} results</div> : null }
					{anomalies ? this.renderAnomalies(anomalies) : <h2> Waiting for Anomalies </h2>}
					</div>
				</div>
			</main>
    )
  }
}

export default App;
