import React from 'react'
import NotefulContext from './App/NotefulContext'
import ValidationError from "./ValidationError";

class addNote extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: "",
        touched: false
      },
      content: {
        value: "",
        touched: false
      }
    };
  }

  updateName(name) {
    this.setState({ name: { value: name, touched: true } });
  }

  updateContent(content) {
    this.setState({ content: { value: content, touched: true } })
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return "Name is required";
    } else if (name.length < 3) {
      return "Name must be at least 3 characters long";
    }
  }

  validateContent() {
    const content = this.state.content.value.trim();
    if (content.length === 0) {
      return "content is a required field"
    }
  }
  render() {
    const nameError = this.validateName();
    const contentError = this.validateContent();
    return (
      <NotefulContext.Consumer>

        {(value) => {


          return (

            < form action=""
              onSubmit={e => {
                e.preventDefault();
                value.handleAddNote(e.target.title.value, e.target.folders.value, e.target.content.value);
              }
              }>
              <label for="title">Name of Note</label>
              <input
                defaultValue="your name here"
                onChange={
                  e => this.updateName(e.target.value)
                } type="text"
                name="title"
              />
              {
                this.state.name.touched &&
                <ValidationError
                  message={nameError} />
              }
              <label for="content">Content of Note</label>
              <input
                defaultValue="your content here"
                type="text"
                name="content"
                id=""
                onChange={
                  e => this.updateContent(e.target.value)
                }
              />
              {this.state.content.touched && <ValidationError
                message={contentError} />}
              <button type="submit">Create Note</button>
              <select name="folders" id="" class="folders" >
                {value.folders.map(folder => {
                  return <option name={folder.name} value={folder.id}>{folder.name}</option>
                })}
              </select>
            </form >

          )
        }}
      </NotefulContext.Consumer>
    )
  }
}

export default addNote