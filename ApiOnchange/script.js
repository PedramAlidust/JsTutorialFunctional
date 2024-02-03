// Add an event listener to the input field
document.getElementById('search-input').addEventListener('input', function() {
    // Call searchPosts when user types in the input field
    searchPosts();
  });
  
  function searchPosts() {
    const searchInput = document.getElementById('search-input').value;
    const apiEndpoint = 'https://ostadshabake.ir/wp-json/wp/v2/posts?search=' + encodeURIComponent(searchInput);
  
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        displayResults(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  
  function displayResults(posts) {
    const resultsContainer = document.getElementById('results');
    const notFoundMessage = document.getElementById('not-found');
  
    resultsContainer.innerHTML = '';
  
    if (posts.length === 0) {
      notFoundMessage.style.display = 'block';
      return;
    }
  
    notFoundMessage.style.display = 'none';
  
    posts.forEach(post => {
      const postTitle = post.title.rendered;
      const postLink = post.link;
  
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `<p><a href="${postLink}" target="_blank">${postTitle}</a></p>`;
      resultsContainer.appendChild(postElement);
    });
  }
  