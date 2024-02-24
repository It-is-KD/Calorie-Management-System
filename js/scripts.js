$(document).ready(function() {
    $('#fetchData').click(function() {
        var query = $('#query').val();
        fetchData(query);
    });

    function fetchData(query) {
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/nutrition?query=' + query,
            headers: { 'X-Api-Key': '66bnx7fkSgQAkFrPpBXghg==ylXre4sYGs4BM010' },
            contentType: 'application/json',
            success: function(result) {
                displayResult(result);
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    }

    // function displayResult(result) {
    //     var resultDiv = $('#result');
    //     resultDiv.empty(); // Clear any previous content
	// 	console.log(result);
    //     var paragraph = $('<p></p>').text(JSON.stringify(result));
    //     resultDiv.append(paragraph);
    // }
	function displayResult(result) {
		// Check if the result is an array and has at least one element
		if (Array.isArray(result) && result.length > 0) {
			var data = result[0]; // Assuming there's only one item in the array
	
			// Update the text content of each <span> element with the corresponding nutritional value
			$('#calorie-list .servingsize .float-end').text(data['serving_size_g']);
			$('#calorie-list li:nth-child(2) .float-end').text(data['carbohydrates_total_g']);
			$('#calorie-list li:nth-child(3) .float-end').text(data['cholesterol_mg']);
			$('#calorie-list li:nth-child(4) .float-end').text(data['fat_saturated_g']);
			$('#calorie-list li:nth-child(5) .float-end').text(data['fat_total_g']);
			$('#calorie-list li:nth-child(6) .float-end').text(data['fiber_g']);
			$('#calorie-list li:nth-child(7) .float-end').text(data['potassium_mg']);
			$('#calorie-list li:nth-child(8) .float-end').text(data['protein_g']);
			$('#calorie-list li:nth-child(9) .float-end').text(data['sodium_mg']);
			$('#calorie-list li:nth-child(10) .float-end').text(data['sugar_g']);
		} else {
			console.error('Invalid or empty response.');
		}
	}
	
	
	
});

//Storage Controller
const StorageCtrl = (function () {
	// public methods
	return {
	  storeItem: function (item) {
		let items;
		//check if any items in local storage
		if (localStorage.getItem("items") === null) {
		  items = [];
		  //push new items
		  items.push(item);
		  //set local storage
		  localStorage.setItem("items", JSON.stringify(items));
		} else {
		  items = JSON.parse(localStorage.getItem("items"));
		  items.push(item);
		  localStorage.setItem("items", JSON.stringify(items));
		}
	  },
	  getItemFromStorage: function () {
		let items;
		if (localStorage.getItem("items") === null) {
		  items = [];
		} else {
		  items = JSON.parse(localStorage.getItem("items"));
		}
		return items;
	  },
	  updateItemStorage: function (updatedItem) {
		let items = JSON.parse(localStorage.getItem("items"));
		items.forEach((item, index) => {
		  if (updatedItem.id === item.id) {
			items.splice(index, 1, updatedItem);
		  }
		});
		localStorage.setItem("items", JSON.stringify(items));
	  },
	  deleteItemStorage: function (itemToDeleteID) {
		let items = JSON.parse(localStorage.getItem("items"));
		items.forEach((item, index) => {
		  if (itemToDeleteID === item.id) {
			items.splice(index, 1);
		  }
		});
		localStorage.setItem("items", JSON.stringify(items));
	  },
	  removeAllItems: function () {
		localStorage.removeItem("items");
	  },
	};
  })();
  
  //Iten Controller
  const ItemCtrl = (function () {
	//item Constructor
	const Item = function (name, calories) {
	  this.id = id.next().value;
	  this.calories = calories;
	  this.name = name;
	};
  
	function* genID() {
	  let id = 1;
	  while (true) {
		yield id++;
	  }
	}
	const id = genID();
  
	// Data Structure / State
	const data = {
	  items: StorageCtrl.getItemFromStorage(),
	  currentItem: null,
	  totalCalories: 0,
	};
  
	//public methods
	return {
	  getItems: function () {
		return data.items;
	  },
	  logData: function () {
		return data;
	  },
	  addItem: function (name, calories) {
		const newItem = new Item(name, parseInt(calories));
		data.items.push(newItem);
		return newItem;
	  },
	  getTotCalories: function () {
		let cal = 0;
		data.items.forEach((item) => {
		  cal += item.calories;
		});
		data.totalCalories = cal;
		return data.totalCalories;
	  },
	  getItemByID: function (id) {
		let found = null;
		data.items.forEach((item) => {
		  if (item.id === id) {
			found = item;
		  }
		});
		return found;
	  },
	  updateItemByID: function (id, name, calories) {
		let updatedItem = null;
		data.items.forEach((item) => {
		  if (item.id === id) {
			item.name = name;
			item.calories = parseInt(calories);
			updatedItem = item;
		  }
		});
		return updatedItem;
	  },
	  setCurrentItem: function (item) {
		data.currentItem = item;
	  },
	  getCurrentItem: function () {
		return data.currentItem;
	  },
	  itemToBeDeleted: function (id) {
		//Get ids;
		const ids = data.items.map((item) => {
		  return item.id;
		});
		const index = ids.indexOf(id);
  
		//Remove itme
		data.items.splice(index, 1);
	  },
	  clearAllItems: function () {
		data.items = [];
	  },
	};
  })();
  
  //UI Controller
  const UICrtl = (function () {
	const UISelectors = {
	  itemList: "#item-list",
	  listItems: "#item-list li",
	  addBtn: ".add-btn",
	  updateBtn: ".update-btn",
	  deleteBtn: ".delete-btn",
	  backBtn: ".back-btn",
	  clearBtn: ".clear-btn",
	  itemNameInput: "#item-name",
	  itemCaloriesInput: "#item-calories",
	  totalCalories: ".total-calories",
	};
  
	// public method
	return {
	  populateItemList: function (items) {
		let html = "";
		items.forEach((item) => {
			html += `
			<li class="list-group-item mb-2 bg-transparent collection-item" id="item-${item.id}">
			  <label>${item.name} - <em>${item.calories} calories/100g</em> </label>
			  <a href="" class="ml-2"><i class="edit-item fa fa-pencil"></i></a> </li>`;
		});
		document.querySelector(UISelectors.itemList).innerHTML = html;
	  },
	  clearEditState: function () {
		UICrtl.clearInputs();
		document.querySelector(UISelectors.updateBtn).style.display = "none";
		document.querySelector(UISelectors.deleteBtn).style.display = "none";
		document.querySelector(UISelectors.backBtn).style.display = "none";
		document.querySelector(UISelectors.addBtn).style.display = "inline";
	  },
	  showEditState: function () {
		document.querySelector(UISelectors.updateBtn).style.display = "inline";
		document.querySelector(UISelectors.deleteBtn).style.display = "inline";
		document.querySelector(UISelectors.backBtn).style.display = "inline";
		document.querySelector(UISelectors.addBtn).style.display = "none";
	  },
	  getSelectors: function () {
		return UISelectors;
	  },
	  getItemInput: function () {
		return {
		  name: document.querySelector(UISelectors.itemNameInput).value,
		  calories: document.querySelector(UISelectors.itemCaloriesInput).value,
		};
	  },
	  addListItem(item) {
		const li = document.createElement("li");
		li.className = "collection-item";
		li.id = `item-${item.id}`;
		li.innerHTML = `
			<label>${item.name} - <em>${item.calories} calories/100g</em> </label>
			<a href="" class="ml-2"><i class="edit-item fa fa-pencil"></i></a>`;
	  	document
		.querySelector(UISelectors.itemList)
		.insertAdjacentElement("beforeend", li);
	  },
	  clearInputs: function () {
		document.querySelector(UISelectors.itemNameInput).value = "";
		document.querySelector(UISelectors.itemCaloriesInput).value = "";
	  },
	  statusList: function (status) {
		document.querySelector(UISelectors.itemList).style.display = status;
	  },
	  updateTotCalories: function (totalCal) {
		document.querySelector(UISelectors.totalCalories).innerHTML = totalCal;
	  },
	  addItemToForm: function () {
		const currentItem = ItemCtrl.getCurrentItem();
		document.querySelector(UISelectors.itemNameInput).value =
		  currentItem.name;
		document.querySelector(UISelectors.itemCaloriesInput).value =
		  currentItem.calories;
		UICrtl.showEditState();
	  },
	  updateListItem: function (item) {
		const listItems = document.querySelectorAll("#item-list li");
		const listItemsConvert = Array.from(listItems);
		listItemsConvert.forEach((li) => {
		  const liID = li.getAttribute("id");
		  if (liID === `item-${parseInt(item.id)}`) {
			li.innerHTML = `
			  <label>${item.name} - <em>${item.calories} calories/100g</em> </label>
			  <a href="" class="edit-item ml-2"><i class="edit-item fa fa-pencil"></i></a>`;
		  }
		});
	  },
	  removeLiItem: function (id) {
		const itemID = `#item-${id}`;
		const item = document.querySelector(itemID);
		item.remove();
	  },
	  removeAllItems: function () {
		const items = document.getElementById("item-list");
		items.innerHTML = "";
	  },
	};
  })();
  
  //App Controller
  const App = (function (ItemCtrl, StorageCtrl, UICrtl) {
	//load event listener
	const loadEventListeners = function () {
	  const UISelectors = UICrtl.getSelectors();
  
	  //add item event
	  document
		.querySelector(UISelectors.addBtn)
		.addEventListener("click", itemAddSubmit);
  
	  //Edit icon click event
	  document
		.querySelector(UISelectors.itemList)
		.addEventListener("click", itemEditClick);
  
	  // Update one item
	  document
		.querySelector(UISelectors.updateBtn)
		.addEventListener("click", itemUpdateSubmit);
  
	  // Return to list adding
	  document
		.querySelector(UISelectors.backBtn)
		.addEventListener("click", function (e) {
		  UICrtl.clearEditState();
		  e.preventDefault();
		});
  
	  //Delte one item
	  document
		.querySelector(UISelectors.deleteBtn)
		.addEventListener("click", deleteItem);
  
	  document
		.querySelector(UISelectors.clearBtn)
		.addEventListener("click", clearAllItem);
  
	  document.addEventListener("keypress", function (e) {
		if (e.keyCode === 13 || e.which === 13) {
		  e.preventDefault();
		  return false;
		}
	  });
	};
  
	//add item submit
	const itemAddSubmit = function (e) {
	  //Get form input from UICtrl
	  const input = UICrtl.getItemInput();
	  if (input.name !== "" && input.calories !== "") {
		const newItem = ItemCtrl.addItem(input.name, input.calories);
  
		//add item to the UI
		UICrtl.addListItem(newItem);
  
		//Get total calorie
		const totalCal = ItemCtrl.getTotCalories();
  
		//Update calorie.
		UICrtl.updateTotCalories(totalCal);
  
		// made list appeared
		UICrtl.statusList("block");
  
		//store in localStorage
		StorageCtrl.storeItem(newItem);
  
		//clear input fields
		UICrtl.clearInputs();
	  }
  
	  e.preventDefault();
	};
  
	const itemEditClick = function (e) {
	  if (e.target.classList.contains("edit-item")) {
		//Get List item id
		const listID = e.target.parentNode.parentNode.id;
  
		//split the item-id tp get omlu te id
		const listIdArr = listID.split("-");
		// get the id number
		const id = parseInt(listIdArr[1]);
  
		//Get Item
		const itemToEdit = ItemCtrl.getItemByID(id);
  
		//set curret item
		ItemCtrl.setCurrentItem(itemToEdit);
  
		//add item to form
		UICrtl.addItemToForm();
	  }
	  e.preventDefault();
	};
  
	const itemUpdateSubmit = function (e) {
	  const input = UICrtl.getItemInput();
	  const itemId = ItemCtrl.getCurrentItem().id;
  
	  // update the data
	  const updatedItemSubmit = ItemCtrl.updateItemByID(
		itemId,
		input.name,
		input.calories
	  );
  
	  // udpate item list in UI
	  UICrtl.updateListItem(updatedItemSubmit);
  
	  //Get total calorie
	  const totalCal = ItemCtrl.getTotCalories();
  
	  //Update calorie.
	  UICrtl.updateTotCalories(totalCal);
  
	  //set ititial states
	  UICrtl.clearEditState();
  
	  //Udpate local storage
	  StorageCtrl.updateItemStorage(updatedItemSubmit);
  
	  //clear input fields
	  UICrtl.clearInputs();
  
	  e.preventDefault();
	};
  
	const deleteItem = function (e) {
	  // retrieve the item id
	  const itemToDeleteID = ItemCtrl.getCurrentItem().id;
  
	  ItemCtrl.itemToBeDeleted(itemToDeleteID);
  
	  UICrtl.removeLiItem(itemToDeleteID);
  
	  //Get total calorie
	  const totalCal = ItemCtrl.getTotCalories();
  
	  //Update calorie.
	  UICrtl.updateTotCalories(totalCal);
  
	  //delete fron local storage
	  StorageCtrl.deleteItemStorage(itemToDeleteID);
  
	  //set ititial states
	  UICrtl.clearEditState();
  
	  e.preventDefault();
	};
  
	const clearAllItem = function (e) {
	  //remove all item in items list
	  ItemCtrl.clearAllItems();
  
	  //Remove items in UI
	  UICrtl.removeAllItems();
  
	  StorageCtrl.removeAllItems();
  
	  //Get total calorie
	  const totalCal = ItemCtrl.getTotCalories();
  
	  //Update calorie.
	  UICrtl.updateTotCalories(totalCal);
  
	  //hide the list
	  UICrtl.statusList("none");
  
	  e.preventDefault();
	};
  
	//public method
	return {
	  init: function () {
		//set ititial states
		UICrtl.clearEditState();
  
		//Fetch items from data structur
		const items = ItemCtrl.getItems();
  
		const totalCal = ItemCtrl.getTotCalories();
		//   update UI consequentlz to totCal
		UICrtl.updateTotCalories(totalCal);
  
		//Check if ther is any items
		if (items.length === 0) {
		  UICrtl.statusList("none");
		} else {
		  //Populate list with items
		  UICrtl.populateItemList(items);
		}
  
		//load Event Listeneers
		loadEventListeners();
	  },
	};
  })(ItemCtrl, StorageCtrl, UICrtl);
  
  //Initilizing App
  App.init();

  function calculatePercentage() {
    const goalCaloriesInput = document.getElementById('goalCalories');
    const resultDiv = document.getElementById('result');

    // Get the value entered by the user
    const goalCalories = parseFloat(goalCaloriesInput.value);

    // Example consumed calories (you can replace this with actual consumed calories)
    const consumedCalories = ItemCtrl.getTotCalories();;

    try {
        // Call the calculatePercentageCompleted function from the previous code snippet
        const percentageCompleted = calculatePercentageCompleted(consumedCalories, goalCalories);
        resultDiv.innerHTML = `<div class="h2 font-weight-bold">${percentageCompleted.toFixed(2)}<sup class="small">%</sup></div>`;
        // resultDiv.innerHTML = `<p class="text-success">You have completed ${percentageCompleted.toFixed(2)}% of your goal.</p>`;

    } catch (error) {
        resultDiv.innerHTML = `<p class="text-danger">${error.message}</p>`;
    }
}

function calculatePercentageCompleted(consumedCalories, goalCalories) {
    // Ensure both consumedCalories and goalCalories are non-negative numbers
    if (typeof consumedCalories !== 'number' || typeof goalCalories !== 'number' || consumedCalories < 0 || goalCalories < 0) {
        throw new Error('Invalid input. Both consumed and goal calories should be non-negative numbers.');
    }

    // Ensure goalCalories is not zero to avoid division by zero error
    if (goalCalories === 0) {
        throw new Error('Goal calories cannot be zero.');
    }

    // Calculate the percentage completed
    const percentageCompleted = (consumedCalories / goalCalories) * 100;

    return percentageCompleted;
}