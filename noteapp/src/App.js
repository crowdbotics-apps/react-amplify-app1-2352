import React, { Component } from "react"

import "./App.css"

import Amplify, { API, graphqlOperation } from "aws-amplify"
import awsmobile from "./aws-exports"
import { withAuthenticator } from "aws-amplify-react"
import { createNote, deleteNote } from "./graphql/mutations"
import { listNotes } from "./graphql/queries"

Amplify.configure(awsmobile)

class App extends Component {
	state = {
		notes: [],
		note: ""
	}

	async componentDidMount() {
		const result = await API.graphql(graphqlOperation(listNotes))

		this.setState({ notes: result.data.listNotes.items })
	}

	handleInputChange = event => this.setState({ note: event.target.value })

	addNote = async event => {
		const { note, notes } = this.state

		event.preventDefault()

		const input = {
			note
		}

		const result = await API.graphql(graphqlOperation(createNote, { input }))

		const newNote = result.data.createNote
		const updatedNotes = [newNote, ...notes]
		this.setState({ notes: updatedNotes, note: "" })
	}

	deleteNote = async noteID => {
		const { notes } = this.state
		const input = { id: noteID }
		const result = await API.graphql(graphqlOperation(deleteNote, { input }))

		const deleteNoteId = result.data.deleteNote.id

		const updatedNotesList = notes.filter(note => note.id !== deleteNoteId)

		this.setState({ notes: updatedNotesList })
	}

	render() {
		return (
			<div className='App'>
				<div className='App-header'>
					<h1>
						<span role='img' aria-label='write'>
							📝
						</span>
						React + Amplify NoteApp
					</h1>
					<form onSubmit={this.addNote} className='form-note'>
						<input
							type='text'
							className='form-input'
							placeholder='Add your note'
							onChange={this.handleInputChange}
							value={this.state.note}
						/>
						<button type='submit' className='form-button'>
							Add
						</button>
					</form>
					<div>
						{this.state.notes.map(item => (
							<div key={item.id} className='notes-list'>
								<li>{item.note}</li>
								<button className='notes-list-button' onClick={() => this.deleteNote(item.id)}>
									<span role='img' aria-label='delete-button'>
										❌
									</span>
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}
}

export default withAuthenticator(App, true)
