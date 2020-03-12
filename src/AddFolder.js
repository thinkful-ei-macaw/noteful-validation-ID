import React from 'react'

class addFolder extends React.Component {
  render() {
    return (
      <form action="" onSubmit={(e) => {
        e.preventDefault();
        this.props.handleAddFolder(e.target.title.value)
      }}>
        <input type="text" name="title" id="folder_input" />
        <button type="submit"

        >Create Folder</button>

      </form>
    )
  }
}

export default addFolder