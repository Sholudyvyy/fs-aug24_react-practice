/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    currentCategory => currentCategory.id === product.categoryId,
  );
  const user = usersFromServer.find(person => person.id === category.ownerId);

  return { product, category, user };
});

const filterProducts = (product, user, categories, query) => {
  return product.filter(item => {
    return (
      (user === 'All' || item.user.name === user) &&
      (categories.length === 0 || categories.includes(item.category.title)) &&
      item.product.name.toLowerCase().includes(query)
    );
  });
};

export const App = () => {
  const [currentUser, setCurrentUser] = useState('All');
  const [currentCategory, setCurrentCategory] = useState([]);
  const [query, setQuery] = useState('');
  const visibleProducts = filterProducts(
    products,
    currentUser,
    currentCategory,
    query,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => currentUser !== 'All' && setCurrentUser('All')}
                className={classNames({
                  'is-active': currentUser === 'All',
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() =>
                    user.name !== currentUser && setCurrentUser(user.name)
                  }
                  className={classNames({
                    'is-active': user.name === currentUser,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={changeEvent =>
                    setQuery(
                      changeEvent.currentTarget.value.trim().toLowerCase(),
                    )
                  }
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    onClick={() => setQuery('')}
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                onClick={() =>
                  currentCategory.length !== 0 && setCurrentCategory([])
                }
                className={classNames('button', 'mr-6', {
                  'is-success': currentCategory.length === 0,
                })}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  onClick={() => {
                    if (currentCategory.includes(category.title)) {
                      setCurrentCategory(
                        currentCategory.filter(item => item !== category.title),
                      );
                    } else {
                      setCurrentCategory([category.title, ...currentCategory]);
                    }
                  }}
                  className={classNames('button', 'mr-2', 'my-1', {
                    'is-info': currentCategory.includes(category.title),
                  })}
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setCurrentCategory([]);
                  setCurrentUser('All');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {visibleProducts.length !== 0 && (
            <table
              data-cy="ProductTable"
              className={classNames(
                'table',
                'is-striped',
                'is-narrow',
                'is-fullwidth',
              )}
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(({ product, category, user }) => {
                  return (
                    <tr key={product.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        {`${category.icon} - ${category.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={classNames(
                          user.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger',
                        )}
                      >
                        {user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
