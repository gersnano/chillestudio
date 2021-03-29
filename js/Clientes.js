console.clear();

class AccordionGrid {
  constructor(grid, options = {}) {


    // DOM elements
    this.grid = grid;
    this.items = grid.querySelectorAll(options.itemSelecotr || '.clients-card-grid .search-result-list > li');
    this.previews = grid.querySelectorAll(options.previewSelector || '.featured-image');
    this.details = grid.querySelectorAll(options.detailsSelector || '.article');
    this.detailsContainer = grid.querySelectorAll(options.detailsContainerSelector || '.field-description');

    // options
    this.openClassName = options.openClassName || 'open';
    this.scrollToTarget = options.scrollToTarget || true;
    this.columns = options.columns || 6;

    // internal state
    this.currentIndex = null;

    // binding
    this.toggleItem = this.toggleItem.bind(this);
    this.resizeItems = this.resizeItems.bind(this);

    // init
    this.init();
  }

  init() {
    this.previews.forEach((preview, index) => {
      preview.addEventListener('click', () => this.toggleItem(index));

    });

    window.addEventListener('resize', this.resizeItems);

    // function resize() {
    //    console.log("width: ", window.innerWidth, "px");
    // }
    // window.onresize = resize;
  }

  nextRowIndex(index) {
    return index + (this.columns - index % this.columns);
  }

  closeItem(index) {
    const detail = this.details[index];

    // close details
    detail.style.height = 0;

    // remove open class to hide indicator
    this.items[index].classList.remove(this.openClassName);

    // move next row up again
    this.resizeNextRow(index, 0);
  }

  openItem(index) {
    const detail = this.details[index];
    const detailHeight = detail.scrollHeight + 'px';

    // open details
    detail.style.height = detailHeight;

    // add open class to show indicator
    this.items[index].classList.add(this.openClassName);

    // move next row down
    this.resizeNextRow(index, detailHeight);

    // scroll to preview
    if (this.scrollToTarget) {
      setTimeout(() => {
        this.previews[index].scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }

  toggleItem(index) {
    if (this.currentIndex === index) {
      // close clicked item
      this.closeItem(index);
      this.currentIndex = null;
    } else {
      // close current item
      if (this.currentIndex !== null) {
        this.closeItem(this.currentIndex);
      }

      // open clicked item
      this.openItem(index);
      this.currentIndex = index;
    }
  }

  resizeNextRow(currentIndex, detailHeight) {
    const nextRowIndex = this.nextRowIndex(currentIndex);

    for (let i = 0; i < this.columns; i++) {
      const item = this.items[nextRowIndex + i];
      if (item) {
        item.style.marginTop = detailHeight;
      }
    }
  }

  resizeItems() {
    if (window.innerWidth > 1278) {
      this.columns = 6;
    } else if (window.innerWidth > 1062) {
      this.columns = 5;
    } else if (window.innerWidth > 884) {
      this.columns = 4;
    } else if (window.innerWidth > 620) {
      this.columns = 3;
    } else if (window.innerWidth > 414) {
      this.columns = 2;
    } else {
      this.columns = 1;
    }
    if (this.currentIndex !== null) {
      const detail = this.details[this.currentIndex];

      // get detail height from inner container to get real height even if outer heigt was set to a bigger value
      const detailHeight = this.detailsContainer[this.currentIndex].scrollHeight + 'px';
      // resize detail height
      detail.style.height = detailHeight;

      // resize next row margin
      this.resizeNextRow(this.currentIndex, detailHeight);
    }
  }}



/*** MAIN ***/
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.clients-card-grid .search-result-list').forEach(grid => {
    new AccordionGrid(grid);
  });
});