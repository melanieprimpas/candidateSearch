import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  // Load saved candidates from localStorage when the component mounts
  useEffect(() => {
    const candidates = JSON.parse(localStorage.getItem('CandidatesSavedList') as string);
    console.log(candidates);
    setSavedCandidates(candidates);
  }, []);
  // Function to handle rejecting a candidate
 const handleReject = (index: number) => {
   const updatedCandidates = [...savedCandidates];
   updatedCandidates.splice(index, 1);

   // Update localStorage and the state
   localStorage.setItem('CandidatesSavedList', JSON.stringify(updatedCandidates));
   setSavedCandidates(updatedCandidates);
 };
  return (
    <>
      <h1>Potential Candidates</h1>
      <table className="table">
       <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Location</th>
          <th>Email</th>
          <th>Company</th>
          <th>Bio</th>
          <th>Reject</th>
        </tr>
       </thead>
       <tbody>
        {savedCandidates.length === 0 ? (
          <tr><td colSpan={7}> No saved candidates found.</td></tr>
        ) : (
          savedCandidates.map((candidate, index) => (
        <tr  key={candidate.id ? candidate.id : index}>
          <td><img className = 'table-img center' src={candidate.avatar_url} alt={`${candidate.name}'s avatar`}/></td>
          <td>{candidate.name}</td>
          <td>{candidate.location}</td>
          <td className='wrap-text'>{candidate.email}</td>
          <td>{candidate.company}</td>
          <td>{candidate.bio}</td>
          <td> <button className = 'delete-button center' onClick={() => handleReject(index)}>-</button></td>
        </tr>
        ))
      )}
        </tbody>
      </table>
    </>
  );
};

export default SavedCandidates;

