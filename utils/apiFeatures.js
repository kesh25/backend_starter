class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // filtering
    const queryObj = {
      ...this.queryString,
    };

    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((queryItem) => delete queryObj[queryItem]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (queryParam) => `$${queryParam}`
    );

    queryStr = JSON.parse(queryStr);

    this.query = this.query.find(queryStr);

    return this;
    //let query = Product.find(queryStr);
  }

  sort() {
    //   sort
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-added");
    }

    return this;
  }

  limitFields() {
    //field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  pagination() {
    //   //pagination
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 100;
    let valSkip = (page - 1) * limit;

    this.query = this.query.skip(valSkip).limit(limit);

    // if (this.queryString.page) {
    // const numProducts = await Product.countDocuments();
    // if (valSkip >= numProducts) throw new Error("This page does not exist");
    // }

    return this;
  }
}

module.exports = APIFeatures;
