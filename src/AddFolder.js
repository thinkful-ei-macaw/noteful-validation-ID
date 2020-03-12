import React from "react";
import { Route, Link } from "react-router-dom";

class addFolder extends React.Component {
  render() {
    return (
      <form
        action=""
        onSubmit={e => {
          e.preventDefault();
          this.props.handleAddFolder(e.target.title.value);
        }}
      >
        <input type="text" name="title" id="folder_input" />
        <Link to="/">
          <button type="submit" _target="">
            Create Folder
          </button>
        </Link>
      </form>
    );
  }
}

export default addFolder;
