<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FreightsResource\Pages;
use App\Filament\Resources\FreightsResource\RelationManagers;
use App\Models\Freights;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class FreightsResource extends Resource
{
    protected static ?string $model = Freights::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('max_weight_kg')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('created_by_user_id')
                    ->required()
                    ->numeric(),
            ]);
    }
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('max_weight_kg')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_by_user_id')
                    ->numeric()
                    ->sortable(),
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
            'index' => Pages\ListFreights::route('/'),
            'create' => Pages\CreateFreights::route('/create'),
            'edit' => Pages\EditFreights::route('/{record}/edit'),
        ];
    }
}
