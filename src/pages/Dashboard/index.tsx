import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import logo from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const repos = localStorage.getItem('@GitExplorer:repos');

    if (repos) {
      return JSON.parse(repos);
    }

    return [];
  });
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem('@GitExplorer:repos', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddNewRepo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite autor/nome do repositório');
      return;
    }

    try {
      const { data } = await api.get(`/repos/${newRepo}`);

      setRepositories([...repositories, data]);
      setNewRepo('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={(e) => handleAddNewRepo(e)}>
        <input
          value={newRepo}
          onChange={(e) => {
            setNewRepo(e.target.value);
            setInputError('');
          }}
          placeholder="Nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repo) => (
          <Link key={repo.full_name} to={`/repository/${repo.full_name}`}>
            <img src={repo.owner.avatar_url} alt={repo.owner.login} />

            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
