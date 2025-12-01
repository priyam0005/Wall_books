import { FaTrash, FaHeart } from 'react-icons/fa';

import styles from '../css/Post.module.css';

import { useContext } from 'react';
import { PostListContext } from '../store/post-list-context';

function just(str) {
  let x = Array.from(str);
  let y = x[0].toUpperCase(); // Correct use of toUpperCase
  x.splice(0, 1, y); // Replaces first character with its uppercase
  return x.join(''); // Logs the modified string
}

function Post({ item }) {
  const { deleteitem, Increment } = useContext(PostListContext);

  const handleIncrement = () => {
    Increment(item.id);
  };

  const handlebutton = () => {
    deleteitem(item.id);
  };

  return (
    <>
      <div
        className="card mb-3"
        style={{
          width: '80%',
          marginTop: '10px',
          marginRight: '5px',
          marginBottom: '15px',
          marginLeft: '10px',
        }}
      >
        <div
          className={`${styles.cardHeader} d-flex justify-content-between align-items-center`}
        >
          {item.userName}

          <button
            style={{ background: 'none', border: 'none' }}
            onClick={handlebutton}
          >
            <span className="badge text-bg-danger">
              <FaTrash></FaTrash>
            </span>
          </button>
        </div>
        <div className="card-body" style={{ backgroundColor: 'bisque' }}>
          <h5 className={styles.cardTitle}>{just(item.title)}</h5>
          <p class="card-text">{item.post}</p>
          <button
            type="button"
            class="btn btn-primary position-relative"
            onClick={handleIncrement}
          >
            <FaHeart />
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {item.remark}
              <span className="visually-hidden">unread messages</span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Post;
