// select items
const alertMsg = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const groceryInput = document.getElementById("grocery-input");
const submitBtn = document.querySelector(".submit-btn");
const listContainer = document.querySelector(".grocery-list-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ! ****** EVENT LISTENERS ******

// submit form
form.addEventListener("submit", addItem);
// clear items
clearBtn.addEventListener("click", clearItems);
// load items
window.addEventListener("DOMContentLoaded", setupItems);

// ! ****** FUNCTIONS ******

function addItem(event) {
  event.preventDefault();
  const value = groceryInput.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id, value);
    // display alert
    displayAlert("item added", "success");
    // show container
    listContainer.classList.add("show-container");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value updated", "success");
    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "warning");
  }
}

function displayAlert(text, action) {
  alertMsg.textContent = text;
  alertMsg.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(() => {
    alertMsg.classList.remove(`alert-${action}`);
  }, 2000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  listContainer.classList.remove("show-container");
  displayAlert("Cleared all items", "warning");
  setBackToDefault();
  localStorage.removeItem("list");
}

// delete function
function deleteItem(event) {
  const groceryItem = event.currentTarget.parentElement.parentElement;
  const id = groceryItem.dataset.id;
  list.removeChild(groceryItem);
  if (list.children.length === 0) {
    listContainer.classList.remove("show-container");
  }
  displayAlert("item removed", "warning");
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}

// edit function
function editItem(event) {
  const groceryItem = event.currentTarget.parentElement.parentElement;
  const itemName = event.currentTarget.parentElement.previousElementSibling;
  // set edit item
  editElement = itemName;
  // set form value
  groceryInput.value = editElement.innerHTML;
  editFlag = true;
  editID = groceryItem.dataset.id;
  submitBtn.textContent = "edit";
  submitBtn.classList.add("editing-notify");
}

// set back to default
function setBackToDefault() {
  groceryInput.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
  submitBtn.classList.remove("editing-notify");
}

// ! ****** LOCAL STORAGE ******

function addToLocalStorage(id, value) {
  const groceryItemData = { id, value };
  let items = getLocalStorage();
  items.push(groceryItemData);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// ! ****** SETUP ITEMS ******

function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    listContainer.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  // add class
  element.classList.add("grocery-item");
  // add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fa fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fa fa-trash"></i>
      </button>
    </div>`;
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  // append child
  list.appendChild(element);
}
