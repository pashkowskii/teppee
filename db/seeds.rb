require 'faker'

100.times do
  Campground.create(
    user_id: 1,
    title: Faker::Address.city,
    description: Faker::Books::Lovecraft.sentence
  )
end