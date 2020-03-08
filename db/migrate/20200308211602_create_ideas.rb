class CreateIdeas < ActiveRecord::Migration[6.0]
  def change
    create_table :ideas do |t|
      t.string :content
      t.integer :impact, default: 1
      t.integer :ease, default: 1
      t.integer :confidence, default: 1
      t.float :average_score

      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
