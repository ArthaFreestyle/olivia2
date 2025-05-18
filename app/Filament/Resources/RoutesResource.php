<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RoutesResource\Pages;
use App\Filament\Resources\RoutesResource\RelationManagers;
use App\Models\Routes;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RoutesResource extends Resource
{
    protected static ?string $model = Routes::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('driver_id')
                    ->relationship('driver', 'id')
                    ->required(),
                Forms\Components\Select::make('vehicle_id')
                    ->relationship('vehicle', 'id')
                    ->required(),
                Forms\Components\Select::make('freight_id')
                    ->relationship('freight', 'id')
                    ->required(),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('distance')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('duration')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('weight')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('weight_name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('geometry')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('driver.id')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('vehicle.id')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('freight.id')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('distance')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('duration')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('weight')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('weight_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRoutes::route('/'),
            'create' => Pages\CreateRoutes::route('/create'),
            'edit' => Pages\EditRoutes::route('/{record}/edit'),
        ];
    }
}
