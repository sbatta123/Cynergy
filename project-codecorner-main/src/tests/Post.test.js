/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Post from '../components/Post';

test('post renders correct content', async () => {
  const data = {
    _id: { $oid: '627844f400faf629e108c0f2' },
    firstName: 'Emma',
    lastName: 'Watson',
    username: 'emmawatson',
    affiliation: 'University of Pennsylvania',
    title: 'testing postsss',
    description: 'testing creating post',
    projectLength: ['1 Month'],
    roles: ['Frontend'],
    sector: ['Education'],
    teamSize: ['6-10 People'],
    techStack: ['Python'],
    timeCommitment: ['1-5 hours/week'],
    timestamp: { $numberDouble: '1.6520357508730E+12' },
  };
  const currentUser = 'emmawatson';
  render(
    <MemoryRouter>
      <Post data={data} currentUser={currentUser} />
    </MemoryRouter>,
  );
  const linkElement1 = screen.getByText(data.title);
  expect(linkElement1).toBeInTheDocument();

  const linkElement2 = screen.getByText(`${data.firstName} ${data.lastName} | ${data.affiliation}`);
  expect(linkElement2).toBeInTheDocument();

  const linkElement3 = screen.getByText(data.description);
  expect(linkElement3).toBeInTheDocument();

  for (let i = 0; i < data.projectLength.length; i += 1) {
    const linkElement = screen.getByText(data.projectLength[i]);
    expect(linkElement).toBeInTheDocument();
  }

  for (let i = 0; i < data.roles.length; i += 1) {
    const linkElement = screen.getByText(data.roles[i]);
    expect(linkElement).toBeInTheDocument();
  }

  for (let i = 0; i < data.sector.length; i += 1) {
    const linkElement = screen.getByText(data.sector[i]);
    expect(linkElement).toBeInTheDocument();
  }

  for (let i = 0; i < data.teamSize.length; i += 1) {
    const linkElement = screen.getByText(data.teamSize[i]);
    expect(linkElement).toBeInTheDocument();
  }
  for (let i = 0; i < data.techStack.length; i += 1) {
    const linkElement = screen.getByText(data.techStack[i]);
    expect(linkElement).toBeInTheDocument();
  }
});
