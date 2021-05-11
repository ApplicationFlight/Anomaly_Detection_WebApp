import React, { Component } from 'react';
import {createApiClient, Anomaly} from './api';
import MaterialTable from "material-table";



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
			<div className='table_container'>
				<MaterialTable className='table'
				columns={[
					{title: 'Timestep', field: 'timestep' },
					{title: 'Correlated Feature 1', field: 'feature1' },
					{title: 'Correlated Feature 2', field: 'feature2' }
				]}
				data={this.state.anomalies}
				title="Results:"
				options={{
		 			filtering: true,
					maxBodyHeight: 370,
	 			}}
				/>
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
					{anomalies ? <div className='text'>Found <mark className='colored'>{anomalies.length}</mark> anomalies</div> : null }
					{anomalies ? this.renderAnomalies(anomalies) : <div className='text'>waiting for request...</div>}
					</div>
				</div>
			</main>
    )
  }
}

export default App;
