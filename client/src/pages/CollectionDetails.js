import React, { Component } from "react";
import Nav from "../components/Nav";
import API from "../utils/API";
import Footer from "../components/Footer";
// import InputField from "../components/InputField";
import { Link } from "react-router-dom";
import "./CollectionDetails.css";
// import moment from "moment";
// import { EditCollection, CreateItem } from "../components/CollectionDetails/";
import EditCollection from "../components/CollectionDetails/EditCollection";
import CreateItem from "../components/CollectionDetails/CreateItem";
import CollectionItems from "../components/CollectionDetails/CollectionItems";

class CollectionDetails extends Component {
  state = {
    newItem: {},
    editCollection: false,
    editItem: false,
    itemChanges: {},
    sorting: {}
  };

  componentDidMount = async () => {
    // const idToSearch = new URLSearchParams(this.props.location.search).get(
    //   "id"
    // );
    // if (this.props.match.params.id) {
    //   console.log("this.props.match.params.id is a thing");
    // } else {
    //   console.log("NO this.props.match.params.id");
    // }
    // try {
    //   console.log("hit try");
    //   console.log(this.props.match.params.id);
    // } catch {
    //   console.log("hit catch");
    // }
    // const idToSearch = this.props.match.params.id;
    // let idToSearch = "";
    try {
      await this.setState({
        collectionId: this.props.location.state.collectionId,
        showCreateItem: true
      });
      // idToSearch = this.props.location.state.collectionId;
      console.log("try");
    } catch {
      if (this.props.match.params.id === undefined) {
        this.setState({ error: true });
        console.log("no id to search");
        console.log("catch-if");
      } else {
        console.log("catch-else");
        await this.setState({
          collectionId: this.props.match.params.id,
          showCreateItem: false
        });
      }
      // idToSearch = "5dd74c9f32ed554f9cb27dba";
    }
    // const idToSearch =
    //   this.props.location.state.collectionId || "5dd74c9f32ed554f9cb27dba";
    // console.log("location url spliced = ");
    // console.log(this.props.location.pathname);
    // const idToSearch = "5dd74c9f32ed554f9cb27dba";
    console.log("id to search = " + this.state.collectionId);
    console.log("---------------");
    if (this.state.collectionId) {
      this.searchCollectionById(this.state.collectionId);
    } else {
      console.log("can't search without and id");
    }
  };

  searchCollectionById = id => {
    API.getCollectionById(id)
      .then(async res => {
        await this.setState({ collection: res.data[0] });
        console.log(this.state.collection);
      })
      .catch(err => console.log(err));
  };

  //edit collection functions

  editCollectionFunction = async () => {
    await this.setState({
      editCollection: true,
      //when you edit the collection it defaults to private to manage the related checkbox
      collectionChanges: { isPrivate: this.state.collection.isPrivate }
    });
    console.log(this.state.collectionChanges);
  };

  updateEditCollection = event => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      collectionChanges: {
        ...prevState.collectionChanges,
        [name]: value
      }
    }));
    console.log(this.state.collectionChanges);
  };

  //the checkbox requires a different function
  handleCheckboxChange = event => {
    //needed to make another const for scope reasons
    const checkedStatus = event.target.checked;
    this.setState(prevState => ({
      collectionChanges: {
        ...prevState.collectionChanges,
        isPrivate: checkedStatus
      }
    }));
  };

  updateCollection = () => {
    API.updateCollection(
      this.state.collection._id,
      this.state.collectionChanges
    )
      .then(res => {
        console.log(res);
        this.searchCollectionById(this.state.collectionId);
        this.setState({
          editItem: false,
          itemChanges: {},
          editCollection: false
        });
      })
      .catch(err => console.log(err));
  };

  //edit item functions

  editItemFunction = async (id, index) => {
    if (id === this.state.collection.items[index]._id) {
      console.log("it matches");
      //setting the state here assures that it will remain false if something goes wrong. I'm double checking that I'm getting the right item
      await this.setState({
        editItem: { id: id, index: index }
      });
    }
    console.log(this.state.editItem);
  };

  updateExistingItem = async event => {
    const { name, value } = event.target;
    await this.setState(prevState => ({
      itemChanges: {
        // object that we want to update
        ...prevState.itemChanges, // keep all other key-value pairs
        [name]: value // update the value of specific key
      }
    }));
    console.log(this.state.itemChanges);
  };

  updateItem = () => {
    API.updateItem(this.state.editItem.id, this.state.itemChanges)
      .then(res => {
        console.log(res);
        this.searchCollectionById(this.state.collectionId);
        this.setState({ editItem: false, itemChanges: {} });
      })
      .catch(err => console.log(err));
  };

  //create new item functions

  createNewItem = async event => {
    event.preventDefault();
    await this.setState(prevState => ({
      newItem: {
        ...prevState.newItem,
        collectionId: this.state.collection._id
      }
    }));
    API.createItem(this.state.newItem)
      .then(async res => {
        console.log(res);
        this.searchCollectionById(this.state.collectionId);
      })
      .catch(err => console.log(err));
  };

  updateNewItem = event => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      newItem: {
        // object that we want to update
        ...prevState.newItem, // keep all other key-value pairs
        [name]: value // update the value of specific key
      }
    }));
  };

  //cancel changes

  cancelUpdate = target => {
    this.setState({
      editItem: false,
      itemChanges: {}
    });
    if (target === "collection") {
      this.setState({ editCollection: false });
    }
  };

  //delete item or collection functions

  deleteItem = itemId => {
    API.deleteItem(itemId, this.state.collection._id)
      .then(res => {
        console.log(res);
        this.searchCollectionById(this.state.collectionId);
        this.setState({ editItem: false, itemChanges: {} });
      })
      .catch(err => console.log(err));
  };

  deleteCollection = () => {
    API.deleteCollection(this.state.collection._id, this.state.profileId)
      .then(res => {
        console.log(res.data);
        this.setState({ collection: false });
      })
      .catch(err => console.log(err));
  };
  // on the first click for each field it sorts it ascending, on the second click it sorts it descending
  // not using localeCompare because it doesn't work with empty fields
  // when changing fields it remembers the setting for each. Is that desirable?
  onSort = async (event, sortKey) => {
    const data = this.state.collection.items;
    if (this.state.sorting[sortKey]) {
      // data.sort((a, b) => a[sortKey].localeCompare(b[sortKey])).reverse();
      data.sort(
        (a, b) =>
          (a[sortKey] === null) - (b[sortKey] === null) ||
          -(a[sortKey] > b[sortKey]) ||
          +(a[sortKey] < b[sortKey])
      );
      await this.setState(prevState => ({
        sorting: {
          ...prevState.sorting,
          [sortKey]: false
        }
      }));
    } else {
      // data.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
      data.sort(
        (a, b) =>
          (a[sortKey] === null) - (b[sortKey] === null) ||
          +(a[sortKey] > b[sortKey]) ||
          -(a[sortKey] < b[sortKey])
      );
      // .reverse(); //swaped + and - signals instead of doing reverse
      await this.setState(prevState => ({
        sorting: {
          ...prevState.sorting,
          [sortKey]: true
        }
      }));
    }
    this.setState(prevState => ({
      collection: {
        ...prevState.collection,
        items: data
      }
    }));
  };
  setWidth = () => {
    const baseNumber = this.state.collection.itemFields.length;
    const baseWidth = Math.floor(100 / baseNumber);
    console.log(baseWidth + "%");
    return {
      width: baseWidth + "%",
      minWidth: "80px"
      // marginLeft: 0,
      // marginRight: 0
    };
  };

  render() {
    return (
      <div>
        <Nav />
        {/* if there is a collection, render it */}
        {this.state.collection && (
          <div key={this.state.collection._id} className="maincontainer">
            <br></br>
            <img
              className="card-img-top"
              src={this.state.collection.image}
              alt={this.state.collection.name}
            />
            <br></br>
            <br></br>
            <h6>
              <strong> COLLECTION NAME: </strong>
              <span style={{ fontWeight: "bolder", fontSize: 25 }}>
                {this.state.collection.name}
              </span>
            </h6>
            <hr />
            {/* if the user clicked the Edit Kollektion button, show the options to edit the collection */}
            {this.state.editCollection && (
              <div>
                <EditCollection
                  handleCheckboxChange={this.handleCheckboxChange}
                  updateEditCollection={this.updateEditCollection}
                  collectionChanges={this.state.collectionChanges}
                  collection={{
                    name: this.state.collection.name,
                    image: this.state.collection.image,
                    isPrivate: this.state.collection.isPrivate
                  }}
                  updateCollection={this.updateCollection}
                  cancelUpdate={() => this.cancelUpdate("collection")}
                  deleteCollection={this.deleteCollection}
                />
                <hr />
              </div>
            )}
            {this.state.showCreateItem && (
              <div>
                <CreateItem
                  itemFields={this.state.collection.itemFields}
                  newItem={this.state.newItem}
                  updateNewItem={this.updateNewItem}
                  createNewItem={this.createNewItem}
                  editCollectionFunction={this.editCollectionFunction}
                />
                <hr />
              </div>
            )}

            <h5>Items in your collection:</h5>
            <br />
            {/* header for the item list that sorts on click */}
            <div className="row itemBox">
              {this.state.collection.itemFields.map((fields, index) => (
                <p
                className="collectionItemField"
                style={this.setWidth()}
                // width="200px"
                key={index}
                onClick={e => this.onSort(e, fields.name)}
              >
                  {fields.displayName}
                </p>
              ))}
            </div>
            {/* if the collection has items, show them */}
            <CollectionItems
              collection={{
                items: this.state.collection.items,
                itemFields: this.state.collection.itemFields,
                image: this.state.collection.image
              }}
              editItem={this.state.editItem}
              itemChanges={this.state.itemChanges}
              updateExistingItem={this.updateExistingItem}
              editItemFunction={this.editItemFunction}
              updateItem={this.updateItem}
              cancelUpdate={() => this.cancelUpdate("item")}
              deleteItem={this.deleteItem}
              editCollection={this.state.editCollection}
              setWidth={this.setWidth}
            />
          </div>
        )}
        {this.state.error && (
          <h1>Woops! Looks like you got here the wrong way!</h1>
        )}

        <br></br>
        <br></br>
        {this.state.showCreateItem ? (
          <Link to="/dashboard">
            <button className="back btn btn-secondary">
              Back to Your Profile
            </button>
          </Link>
        ) : (
            <button onClick={() => window.history.back()}className="back btn btn-secondary">Back to Landing</button>
        )}
        <Footer />
      </div>
    );
  }
}

export default CollectionDetails;
