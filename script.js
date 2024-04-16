const books =[];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book"
const STORAGE_KEY = "BOOK-APPS"

function generateId(){
    return +new Date();
}
function generateBookObject(id, title, author, year, isComplete){
  year = parseInt(year);
    return{
        id,
        title,
        author,
        year,
        isComplete,
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputbook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook(); resetForm();
    });

    if(isStorageExist()){
      loadDataFromStorage();
    }
  }
  );

  function resetForm() {
    const form = document.getElementById("inputbook"); 
    form.reset();
  }

  document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
  });

  function addBook() {
    const titlebook = document.getElementById("inputbooktitle").value;
    const authorbook = document.getElementById("inputbookauthor").value;
    const yearbook = document.getElementById("inputbookyear").value;
    const checkbook = document.getElementById("read-status").checked;
  
    const generatedID = generateId();
    const bookObject = generateBookObject(
      generatedID,
      titlebook,
      authorbook,
      yearbook,
      checkbook
    );
  
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
  }
  

function makeBook(bookObject) {
  const booktitle = document.createElement('h2');
  booktitle.innerText = bookObject.title;
 
  const bookauthor = document.createElement('p');
  bookauthor.innerText = bookObject.author;

  const yearpublish = document.createElement('p');
  yearpublish.innerText = bookObject.year;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(booktitle, bookauthor, yearpublish);
 
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  const button = document.createElement("button");
  button.classList.add("move-button");

  if (bookObject.isComplete) {
    button.textContent = "Belum Dibaca";
    button.addEventListener("click", function () {
    toggleBookCompletion(bookObject.id);});

  } else {
    button.textContent = "Telah Dibaca";
    button.addEventListener("click", function () {
      toggleBookCompletion(bookObject.id);
    });

}
const deleteButton = document.createElement("button");
deleteButton.classList.add("delete-button");
deleteButton.textContent = "Hapus";
deleteButton.addEventListener("click", function () {
removeBook(bookObject.id);
});
container.append(button, deleteButton);



return container;
}


function toggleBookCompletion(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = !bookTarget.isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted (bookId){
  const bookTarget = findBook(bookId);

  if(bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFrominCompleted (bookId){
  const bookTarget = findBook(bookId);

  if(bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook (bookId){
  const bookTarget = findBookIndex(bookId);

  if(bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId){
  for(const index in books){
    if(books[index].id === bookId){
      return index;
    }
  }
  return -1;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

const searchButton = document.getElementById("searchsubmit");
searchButton.addEventListener("click", function (event) {
  event.preventDefault();

  const searchTitle = document.getElementById("searchbooktitle").value;

  searchBook(searchTitle);
});

function searchBook(searchTitle) {
  let bookFound = false; 

  const bookCards = document.querySelectorAll('.item');

  for (const card of bookCards) {
    const bookTitle = card.querySelector('h2').textContent;
    if (bookTitle.toLowerCase().includes(searchTitle.toLowerCase())) {
      card.style.backgroundColor = "yellow";
      bookFound = true; 
      break; 
    } else {
      card.style.backgroundColor = "";
    }
  }

  if (!bookFound) {
    alert("Maaf, buku yang Anda cari tidak ditemukan.");
  }
}


document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('incompletebookshelf');
  uncompletedBOOKList.innerHTML = '';

  const completedBOOKList = document.getElementById('completebookshelf');
  completedBOOKList.innerHTML = '';
 
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if(!bookItem.isComplete)
    uncompletedBOOKList.append(bookElement);
  else completedBOOKList.append(bookElement);
  }
});
