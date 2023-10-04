import React, { useState, useEffect } from "react";

interface BudgetAllocation {
  id: number;
  market: number;
  development: number;
  sell: number;
}

const budget: number = 1200000 ;

const App: React.FC = () => {
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>([]);
  const [market, setMarket] = useState<number>(0);
  const [development, setDevelopment] = useState<number>(0);
  const [sell, setSell] = useState<number>(0);
  const [idToEdit, setIdToEdit] = useState<number>(0);
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load data from local storage on initial render (if exists)
  useEffect(() => {
    const savedAllocations = JSON.parse(localStorage.getItem("budgetAllocations") || "[]");
    if(savedAllocations.length > 0) {
      setBudgetAllocations(savedAllocations)
    }
    setLoading(false);
  }, []);
  
  // Save data to local storage whenever budgetAllocations state changes
  useEffect(() => {
    localStorage.setItem("budgetAllocations",JSON.stringify(budgetAllocations));
  }, [budgetAllocations]);

  const emptyValues = (): void  => {
    setMarket(0);
    setDevelopment(0);
    setSell(0);
  }
  const allocateBudget = (): void => {
    const totalBudget: number = market + development + sell;
    if (totalBudget === budget) {
      const newAllocation: BudgetAllocation = {
        id: budgetAllocations.length === 0 ? 1 : budgetAllocations[budgetAllocations.length - 1].id + 1,
        market,
        development,
        sell,
      };
      setBudgetAllocations([...budgetAllocations, newAllocation]);

      // Empty input values after allocation
      emptyValues()
    } else {
      alert(`Den totala allokerade summan ska vara ${budget.toLocaleString()}.`);
    }
  };

  const editAllocation = (allocation: BudgetAllocation): void => {
    setEdit(true);
    setIdToEdit(allocation.id);
    setMarket(allocation.market);
    setDevelopment(allocation.development);
    setSell(allocation.sell);
  };

  const updateAllocation = (): void => {
    const editedAllocationIndex = budgetAllocations.findIndex(
      (allocation) => allocation.id === idToEdit
    );
    // if the allocation exists edit it.
    if (editedAllocationIndex !== -1) {
      const updatedAllocations = [...budgetAllocations];
      updatedAllocations[editedAllocationIndex] = {
        id: idToEdit,
        market,
        development,
        sell,
      };
      setBudgetAllocations(updatedAllocations);
    }
    setEdit(false);
    emptyValues()
  };

  const deleteAllocation = (id: number): void => {
    setEdit(false);
    const updatedAllocations = budgetAllocations.filter(allocation => allocation.id !== id);

    setBudgetAllocations(updatedAllocations);
    emptyValues()
  };
  const leftOfBudget: number = budget - (market + development + sell);

  if (loading) {
    return <div>Loading...</div>
  } else {
    return (
      <div className="container">
        <h1>RMT Budget Allokering</h1>
        <p className={leftOfBudget < 0 ? "minus" : ""}>Budgeten som ska allokeras är {(leftOfBudget).toLocaleString()}</p>
        <label>Marknad Avdelning Budget: {market.toLocaleString()}</label>
        <input
          type="range"
          min={0}
          max={budget - (development + sell)}
          step={1000}
          value={market}
          onChange={(e) => setMarket(parseInt(e.target.value))}
        />
        <br />

        <label>Utveckling Avdelning Budget: {development.toLocaleString()}</label>
        <input
          type="range"
          min={0}
          max={budget - (market + sell)}
          step={1000}
          value={development}
          onChange={(e) => setDevelopment(parseInt(e.target.value))}
        />
        <br />

        <label>Sälj Avdelning Budget: {sell.toLocaleString()}</label>
        <input
          type="range"
          min={0}
          max={budget - (market + development)}
          step={1000}
          value={sell}
          onChange={(e) => setSell(parseInt(e.target.value))}
        />
        <br />
        {edit ? (
          <button onClick={updateAllocation}><span>Uppdatera </span>Budgeten</button>
        ) : (
          <button onClick={allocateBudget}><span>Allokera </span>Budgeten</button>
        )}

        <h2>Budget Allokeringar</h2>
        <ul>
          {budgetAllocations.map((allocation) => (
            <li key={allocation.id}>
              ID: {allocation.id}, Marknad: {allocation.market}, Utveckling:{" "}
              {allocation.development}, Sälj: {allocation.sell}{" "}
              <button className="optionButton" onClick={() => editAllocation(allocation)}>Redigera</button>
              <button className="optionButton" onClick={() => deleteAllocation(allocation.id)}>Ta bort</button>
              <hr ></hr>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default App;
