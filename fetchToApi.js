class FetchToApi {
  fetch = async (url) => {
    const data = await fetch(url);
    const result = await data.json();

    return result;
  };
}
export default FetchToApi;
