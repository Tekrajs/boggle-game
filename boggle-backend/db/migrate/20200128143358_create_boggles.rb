class CreateBoggles < ActiveRecord::Migration[6.0]
  def change
    create_table :boggles do |t|
      t.string :name
      t.integer :score
      t.string :identifier

      t.timestamps
    end
  end
end
