import adjustDifficulty from './adjustDifficulty';

//podem crear un rang on no saugmenti ni disminueixi

describe('adjustDifficulty()', () => {
  let block;

  //inicializamos antes de cualquier test
  beforeEach(() => {
    block = { timestamp: Date.now(), difficulty: 3 };
  });

  it('lowers the difficulty for slowly mined blocks', () => {
    expect(adjustDifficulty(block, block.timestamp + 60000)).toEqual(block.difficulty - 1);
  });

  it('increased the difficulty for quick mined blocks', () => {
    expect(adjustDifficulty(block, block.timestamp + 1000)).toEqual(block.difficulty + 1);
  });
});
