var text = "";

document.getElementById("search-form").addEventListener("submit", function (event) {
	event.preventDefault(); // Prevent form from submitting

	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	};

	var password = getCookie("password");
	// console.log("password: " + password);
	var check = 'false';

	// double confirm the password (not necessary)
	fetch("http://localhost:6060", {
		headers: { "Content-Type": 'application/json' },
		method: "POST",
		body: JSON.stringify({ key: password }),
	})
		.then((response) => response.text())
		.then((data) => {
			// console.log("data:" + data);
			check = data.replace(/^"(.*)"$/, '$1');

			if (correct == false && check == 'false') { // if the user's key query is wrong (or refreshed the page) AND cookie got expired
				$('#keyquery').modal('show');
			} else {
				var input = document.getElementById("search-input"); // Get search input
				var searchTerm = input.value; // Get search term
				searchTerm = searchTerm.trim()
				// question mark not added in case the query is more than a simple question
				// if (!searchTerm.endsWith("?")) {
				// 	searchTerm += "?";
				// } 
				if (searchTerm) { // If search term is not empty
					// Create a single list item for both question and answer
					var listItem = document.createElement("li");
					listItem.classList.add("list-group-item");
					listItem.innerHTML = '<b>Q: </b>' + searchTerm;
					document.getElementById("search-history").append(listItem);
					input.value = ""; // Clear search input
					const submitButton = document.getElementById("button-addon2");
					submitButton.setAttribute("disabled", "true");
					listItem.innerHTML += "<br><b>A: </b><span class='loader__dot'>.</span><span class='loader__dot'>.</span><span class='loader__dot'>.</span>";

					fetch("http://localhost:5000", {
						headers: { "Content-Type": 'application/json' },
						method: "POST",
						body: JSON.stringify({ question: text + searchTerm, search: searchTerm }),
					})
						.then((response) => response.text())
						.then((data) => {
							// console.log(data);
							data = data.replace(/^"(.*)"$/, '$1');
							data = data.replace(/\\n/g, '<br>');
							data = data.replace(/\\"/g, '"');
							// console.log(data);
							// data = data.replace(/\n/g, '<br>');
							// update the innerHTML of the list item to include the answer
							listItem.innerHTML = listItem.innerHTML.replace('<span class="loader__dot">.</span><span class="loader__dot">.</span><span class="loader__dot">.</span>', data);
							text = text + "Q: " + searchTerm + " A: " + data + " ";
							submitButton.removeAttribute("disabled");
						})
						.catch(error => console.error(error));
				};
			}

		})
		.catch(error => console.error(error));
});