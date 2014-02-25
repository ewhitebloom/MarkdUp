class CreateMicroposts < ActiveRecord::Migration
  def change
    create_table :microposts do |t|
      t.string :content
      t.string :category
      t.integer :user_id
      t.string :address
      t.float :latitude
      t.float :longitude


      t.timestamps
    end
    add_index :microposts, [:user_id, :created_at]
  end
end
