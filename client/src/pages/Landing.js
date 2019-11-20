//this is the page that will render as soon as someone opens the website
import React, { Component } from "react";
// import Nav from "../components/Nav";

import AddForm from "../components/AddForm";
import DropdownButton from "../components/DropdownButton";
import Nav from "../components/Nav";
import API from "../utils/API"; //new
import Footer from "../components/Footer";


class Landing extends Component {
  state = {
    name: [],

    type: "cards",
    data: "", //won't be needed, we search right away for now
    searchResult: []
  };

  handleInputChange = async event => {
    const { name, value } = event.target;
    await this.setState({
      [name]: value
    });
    // console.log(this.state.name);
    // console.log(this.state.type);
  };

  //if we search with a input field
  // handleFormSubmit = event => {
  //   event.preventDefault();
  //   console.log(this.state.type);
  //   API.getCollectionByType(this.state.type)
  //     .then(res => console.log(res.data))
  //     .catch(err => console.log(err));
  // };

  //if we search with the dropdown
  makeSearch = text => {
    // event.preventDefault();
    console.log(text);
    // await this.setState({ data: text });
    // console.log(this.state.data);
    API.getCollectionByType(text)
      .then(res => {
        console.log(res.data);
        this.setState({ searchResult: res.data });
      })
      .catch(err => console.log(err));

  };

  render() {
    return (
      <div>

        <h1>At least we have something</h1>
        <AddForm text={"Search Collection Type"}>
          <DropdownButton onClick={() => this.makeSearch("music")}>
            Music
          </DropdownButton>
          <DropdownButton onClick={() => this.makeSearch("comics")}>
            Comics
          </DropdownButton>
          <DropdownButton onClick={() => this.makeSearch("currency")}>
            Currency
          </DropdownButton>
          <DropdownButton onClick={() => this.makeSearch("cards")}>
            Cards
          </DropdownButton>
        </AddForm>
        {this.state.searchResult.length ? (
          <div className="this should be the List component">
            {this.state.searchResult.map((collection, index) => (
              <div
                className="this should be the ListItem component"
                key={index}
              >
                <h4>Name</h4>
                <p>{collection.name}</p>
                <h4>Type</h4>
                <p>{collection.type}</p>
                {collection.isPivate ? (
                  <p>This collection is private</p>
                ) : (
                  <h4>This collection is not private</h4>
                )}
                <h4>Items</h4>
                {collection.items.length ? (
                  collection.items.map(item => <p>{item}</p>)
                ) : (
                  <p>No items to show</p>
                )}
                <p>--space--</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Make a search to see results!</p>
        )}
      </div>
    );
  }
}

export default Landing;

/* <form>
          <AddForm
            value={this.state.name}
            onChange={this.handleInputChange}
            name="name"
            placeholder="Name"
          />
          <AddForm
            value={this.state.type}
            onChange={this.handleInputChange}
            name="type"
            placeholder="Type"
          />
          <FormBtn onClick={this.handleFormSubmit}>Button</FormBtn>
        </form> */
