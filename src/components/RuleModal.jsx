import React from "react";

function RuleModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="rule-overlay">
      <div className="rule-content">
        <h2 className="rule-title">2048 Badge</h2>
        <p style={{ textAlign: "left" }}>
          By accumulating scores through completing 2048 game sessions, once the
          scores reach a certain level, players can mint a corresponding unique
          NFT badge. Currently, there are four badge levels:{" "}
          <strong>Initiation</strong>, <strong>Valor</strong>,{" "}
          <strong>Wisdom</strong>, and <strong>Glory</strong>.
        </p>

        <div className="badge-section">
          {/* NFT Badge 1 */}
          <div className="badge-item">
            <img
              src="https://i.postimg.cc/XN5pQnvm/1750494639.jpg"
              alt="Initiation Badge"
              className="badge-thumb"
            />
            <div className="badge-info">
              <strong>Initiation Badge</strong> (require score >10,000) 
              <p>
                <strong>[Level1]</strong> For players who are just starting the game, symbolizing the
                beginning of their adventure in the world of 2048.
              </p>
            </div>
          </div>

          {/* NFT Badge 2 */}
          <div className="badge-item">
            <img
              src="https://i.postimg.cc/mrqgynWT/1421317652.jpg"
              alt="Valor Badge"
              className="badge-thumb"
            />
            <div className="badge-info">
              <strong>Valor Badge</strong> (require score >20,000)
              <p>
              <strong>[Level2]</strong> For players who have mastered certain skills, symbolizing their
                continuous progress and fighting spirit in the game.
              </p>
            </div>
          </div>

          {/* NFT Badge 3 */}
          <div className="badge-item">
            <img
              src="https://i.postimg.cc/LX16CVmL/535677802.jpg"
              alt="Wisdom Badge"
              className="badge-thumb"
            />
            <div className="badge-info">
              <strong>Wisdom Badge</strong> (require score >50,000)
              <p>
              <strong>[Level3]</strong> For those who can think deeply and plan strategically,
                symbolizing their wisdom and strategy in 2048.
              </p>
            </div>
          </div>

          {/* NFT Badge 4 */}
          <div className="badge-item">
            <img
              src="https://i.postimg.cc/D0QfFyJz/1488291647.jpg"
              alt="Glory Badge"
              className="badge-thumb"
            />
            <div className="badge-info">
              <strong>Glory Badge</strong> (require score >200,000)
              <p>
              <strong>[Level4]</strong> For top players, representing their outstanding achievements and
                supreme glory in the world of 2048.
              </p>
            </div>
          </div>
        </div>

        <div className="rule-footer">
          <div className="close-button" onClick={onClose}>
            Close
          </div>
        </div>
      </div>
    </div>
  );
}

export default RuleModal;
