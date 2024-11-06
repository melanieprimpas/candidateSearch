import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';

import type { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {

  const [index, setIndex] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const addToSavedCandidates = () => {
    let parsedSavedList: Candidate[] = [];
    const storedSavedList = localStorage.getItem('CandidatesSavedList')
    if (typeof storedSavedList === 'string') {
      parsedSavedList = JSON.parse(storedSavedList);
    }
    parsedSavedList.push(candidates[index]);
    localStorage.setItem(
      'CandidatesSavedList',
      JSON.stringify(parsedSavedList)
    )
  }

  const getCandidates = async () => {
    try {
      //searchGithub user gets an array of users but not all of the needed user properties
      const results = await searchGithub();
      console.log(results, "Line 28")

      const loginResults: { login: string }[] = results.map((result: any) => ({
        login: result.login
      }))

      //console.log(loginResults, "Linee 29")
      const usersArray = (loginResults.map((user) => user.login))
      //console.log(usersArray, "line 36")

      //get the array of usersnames to then put through searchGithubUser to get all of the properties
      const dataArray: any[] = await Promise.all(
        usersArray.map(async (user) => {
          try {
            return await searchGithubUser(user);

          } catch (error) {
            //console.error(`Error fetching data for user ${user}:`, error);
            return null;
          }
        }))

      //console.log(dataArray, "Linee 32")

      // Filter out any null results if needed
      const filteredDataArray = dataArray.filter(user => user && Object.keys(user).length > 0);
      //console.log(filteredDataArray, "line 53")
    

      const candidateDataArray = filteredDataArray.map(user => ({
        id: user.id,
        name: user.name,
        username: user.login,
        location: user.location,
        avatar_url: user.avatar_url,
        email: user.email,
        html_url: user.html_url,
        company: user.company,
        bio: user.bio
      }))

      setCandidates(candidateDataArray);
      console.log(results)
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  }

  const nextCandidate = () => {
    setIndex((prevIndex) => (prevIndex + 1) % candidates.length);
  }

  useEffect(() => {
    getCandidates();
  }, []);

  return (
    <div>
      <h1>Candidate Search</h1>
      <ul>
        {candidates.length > 0 && (
          <div>
            <section className = "candidate-details">
              <img src={candidates[index].avatar_url} alt={candidates[index].name} />
              <h2>{candidates[index].username}</h2>
              <h3>Location: {candidates[index].location}</h3>
              <h3>Email: {candidates[index].email}</h3>
              <h3>Company: {candidates[index].company}</h3>
              <h3>Bio: {candidates[index].bio}</h3>
            </section>
            <section className = "buttons">
              <button className="delete-button" onClick={() => {
                nextCandidate();
              }}>-</button>
              <button className="add-button" onClick={() => {
                addToSavedCandidates();
                nextCandidate();
              }}>+</button>
            </section>
          </div>
        )}

      </ul>
    </div>
  );
};

export default CandidateSearch;
