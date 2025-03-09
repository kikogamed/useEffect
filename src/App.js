import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [term, setTerm] = useState("javascript");
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResult = result.map((el, idx) => {
    return (
      <tr key={el.pageid}>
        <td>{idx + 1}</td>
        <td>{el.title}</td>
        <td>
          <span dangerouslySetInnerHTML={{ __html: el.snippet }} />
        </td>
      </tr>
    );
  });

  useEffect(() => {
    //API
    const search = async () => {
      const respond = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          srsearch: term,
        },
      });
      setResult(respond.data.query.search);
      setIsLoading(false);
    };

    if (!result.length) {
      if (term) {
        search();
      }
    } else {
      const debounceSearch = setTimeout(() => {
        if (term) {
          search();
          setIsLoading(true);
        }
      }, 1200);

      return () => {
        clearTimeout(debounceSearch);
      };
    }
  }, [term]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="my-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Search Input
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              onChange={(e) => setTerm(e.target.value)}
              value={term}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Desc</th>
              </tr>
            </thead>
            <tbody>{!isLoading ? fetchResult : "Loading..."}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
