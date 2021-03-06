import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteListNav from "../NoteListNav/NoteListNav";
import NotePageNav from "../NotePageNav/NotePageNav";
import NoteListMain from "../NoteListMain/NoteListMain";
import NotePageMain from "../NotePageMain/NotePageMain";
import { getNotesForFolder, findNote, findFolder } from "../notes-helpers";
import "./App.css";
import NotefulContext from "./NotefulContext";
import AddNote from "../addNote";
import AddFolder from "../AddFolder";
import ErrorScreen from "../ErrorScreen";

class App extends Component {
  state = {
    notes: [],
    folders: [],
    selectedFolder: "no folder"
  };
  ///initial api calls
  componentDidMount() {
    fetch("http://localhost:9090/folders")
      .then(response => response.json())
      .then(data => {
        this.setState({
          folders: data
        });
      });

    fetch("http://localhost:9090/notes")
      .then(response => response.json())
      .then(data => {
        this.setState({
          notes: data
        });
      });
  }

  ///functions to modify the list
  handleDelete = noteId => {
    console.log("delete");
    fetch(`http://localhost:9090/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      }
    });
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    });
  };

  handleAddFolder = name => {
    fetch("http://localhost:9090/folders", {
      method: "POST",
      body: JSON.stringify({ name: name }),
      headers: {
        "content-type": "application/json"
      }
    });
    this.setState({
      folders: [...this.state.folders, { name: name }]
    });
    console.log(this.state.folders);
  };

  handleAddNote = (name, folderId, content) => {
    fetch("http://localhost:9090/notes", {
      method: "POST",
      body: JSON.stringify({
        folderId: folderId,
        name: name,
        content: content
      }),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(response => (response = response.json()))
      .then(data => {
        this.setState({ notes: [...this.state.notes, data] });
        console.log(this.state.notes);
      });
  };

  ///render methods
  renderNavRoutes() {
    const { notes, folders } = this.state;
    const contextValue = {
      notes: this.state.notes,
      folders: this.state.folders,
      handleDelete: this.handleDelete
    };
    return (
      <NotefulContext.Provider value={contextValue}>
        {["/", "/folder/:folderId"].map(path => (
          <Route
            exact
            key={path}
            path={path}
            // pass these through context:

            render={routeProps => <NoteListNav {...routeProps} />}
          />
        ))}
        <Route
          path="/note/:noteId"
          render={routeProps => {
            const { noteId } = routeProps.match.params;
            const note = findNote(notes, noteId) || {};
            const folder = findFolder(folders, note.folderId);
            return <NotePageNav {...routeProps} folder={folder} />;
          }}
        />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </NotefulContext.Provider>
    );
  }

  renderMainRoutes() {
    const { notes, folders } = this.state;
    const contextValue = {
      note: this.state.notes,
      folders: this.state.folders,
      handleDelete: this.handleDelete,
      handleAddNote: this.handleAddNote,
      handleFolderSelect: this.handleFolderSelect,
      folderId: this.state.folderId
    };

    return (
      <NotefulContext.Provider value={contextValue}>
        {["/", "/folder/:folderId"].map(path => (
          <Route
            exact
            key={path}
            path={path}
            render={routeProps => {
              const { folderId } = routeProps.match.params;
              const notesForFolder = getNotesForFolder(notes, folderId);
              return <NoteListMain {...routeProps} notes={notesForFolder} />;
            }}
          />
        ))}
        <Route
          path="/note/:noteId"
          render={routeProps => {
            const { noteId } = routeProps.match.params;
            const note = findNote(notes, noteId);
            return <NotePageMain {...routeProps} note={note} />;
          }}
        />
        <Route
          path="/addNote"
          render={routeProps => {
            return <AddNote />;
          }}
        />
        <Route
          path="/AddFolder"
          render={rprops => {
            return (
              <AddFolder {...rprops} handleAddFolder={this.handleAddFolder} />
            );
          }}
        />
      </NotefulContext.Provider>
    );
  }
  ///main render
  render() {
    return (
      <ErrorScreen>
        <div className="App">
          <nav className="App__nav">{this.renderNavRoutes()}</nav>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>{" "}
              <FontAwesomeIcon icon="check-double" />
            </h1>
          </header>
          <main className="App__main">{this.renderMainRoutes()}</main>
        </div>
      </ErrorScreen>
    );
  }
}

export default App;
